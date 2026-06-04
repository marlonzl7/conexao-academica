package com.academica.conexao.infra.email.service;

import com.academica.conexao.infra.dto.ResultadoETL;
import com.academica.conexao.infra.email.dao.UsuarioNotificacaoDAO;
import com.academica.conexao.infra.log.LogLevel;
import com.academica.conexao.infra.log.LogsManager;
import java.util.List;

public class NotificacaoETLService {

    private final EmailService emailService;
    private final UsuarioNotificacaoDAO dao;
    private final LogsManager logs;

    private static final String DOMINIO = System.getenv("DOMINIO");

    public NotificacaoETLService(EmailService emailService, UsuarioNotificacaoDAO dao, LogsManager logs) {
        this.emailService = emailService;
        this.dao = dao;
        this.logs = logs;
    }

    public void notificar(ResultadoETL resultadoETL) {
        List<String> emailsAdministradoresSistema = dao.buscarEmailPorCargo("administrador_sistema");

        if (!emailsAdministradoresSistema.isEmpty()) {
            enviarEmails(emailsAdministradoresSistema, "ETL Finalizado", montarMensagemAdminSistema(resultadoETL));
        } else {
            logs.log(LogLevel.INFO, getClass().getSimpleName(), "Nenhum administrador de sistema encontrado para notificar");
        }

        List<String> emailsAdministradoresInstituicao = dao.buscarEmailPorCargo("administrador_instituicao");

        if (!emailsAdministradoresInstituicao.isEmpty()) {
            enviarEmails(emailsAdministradoresInstituicao, "Dados da sua instituição foram atualizados", montarMensagemAdminInstituicao());
        } else {
            logs.log(LogLevel.INFO, getClass().getSimpleName(), "Nenhum administrador de instituição encontrado para notificar");
        }
    }

    public void enviarEmails(List<String> emails, String assunto, String conteudo) {
        for (String email : emails) {
            if (email != null) {
                emailService.enviar(email, assunto, conteudo);
            }
        }
    }

    private String montarMensagemAdminSistema(ResultadoETL etlResultado) {
        StringBuilder linhasBases = new StringBuilder();
        for (String base : etlResultado.getBasesProcessadas()) {
            linhasBases.append("<li>").append(base).append("</li>");
        }

        return """
            <html>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 32px;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                
                <div style="background-color: #1a1a2e; padding: 24px 32px;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 20px;">Conexão Acadêmica</h1>
                  <p style="color: #a0a0c0; margin: 4px 0 0;">Relatório de ETL</p>
                </div>

                <div style="padding: 32px;">
                  <p style="color: #333333; font-size: 15px;">O processo de ETL foi concluído com sucesso.</p>

                  <div style="background-color: #f0f4ff; border-left: 4px solid #4a6cf7; padding: 16px; border-radius: 4px; margin: 24px 0;">
                    <p style="margin: 0; color: #555; font-size: 14px;">Duração total</p>
                    <p style="margin: 4px 0 0; color: #1a1a2e; font-size: 22px; font-weight: bold;">%.2fs</p>
                  </div>

                  <p style="color: #333333; font-size: 15px; margin-bottom: 8px;"><strong>Bases processadas:</strong></p>
                  <ul style="color: #555555; font-size: 14px; padding-left: 20px; line-height: 1.8;">
                    %s
                  </ul>
                </div>

                <div style="background-color: #f8f8f8; padding: 16px 32px; text-align: center;">
                  <p style="color: #aaaaaa; font-size: 12px; margin: 0;">Este é um email automático. Não responda a esta mensagem.</p>
                </div>
              </div>
            </body>
            </html>
            """.formatted(etlResultado.getDuracaoSegundos(), linhasBases);
    }

    private String montarMensagemAdminInstituicao() {
        String url = DOMINIO != null ? DOMINIO : "http://projeto-conexao-academica.duckdns.org";

        return """
            <html>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 32px;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                
                <div style="background-color: #1a1a2e; padding: 24px 32px;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 20px;">Conexão Acadêmica</h1>
                  <p style="color: #a0a0c0; margin: 4px 0 0;">Atualização de dados</p>
                </div>

                <div style="padding: 32px;">
                  <p style="color: #333333; font-size: 15px;">Olá,</p>
                  <p style="color: #333333; font-size: 15px;">
                    Os dados da sua instituição foram <strong>atualizados com sucesso</strong> no sistema Conexão Acadêmica.
                  </p>
                  <p style="color: #555555; font-size: 14px;">
                    Acesse a plataforma para visualizar as informações mais recentes, incluindo indicadores de matrícula e evasão.
                  </p>

                  <div style="text-align: center; margin: 32px 0;">
                    <a href="%s" style="background-color: #4a6cf7; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-size: 15px; font-weight: bold;">
                      Acessar plataforma
                    </a>
                  </div>
                </div>

                <div style="background-color: #f8f8f8; padding: 16px 32px; text-align: center;">
                  <p style="color: #aaaaaa; font-size: 12px; margin: 0;">Este é um email automático. Não responda a esta mensagem.</p>
                </div>
              </div>
            </body>
            </html>
            """.formatted(url);
    }

}
