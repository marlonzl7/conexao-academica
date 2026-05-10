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

    public NotificacaoETLService(EmailService emailService, UsuarioNotificacaoDAO dao, LogsManager logs) {
        this.emailService = emailService;
        this.dao = dao;
        this.logs = logs;
    }

    public void notificar(ResultadoETL resultadoETL) {
        List<String> emailsAdministradores = dao.buscarEmailPorCargo("administrador");

        if (!emailsAdministradores.isEmpty()) {
            String assunto = "ETL finalizado";
            String conteudo = montarMensagemAdmin(resultadoETL);
            enviarEmails(emailsAdministradores, assunto, conteudo);
        } else {
            logs.log(LogLevel.INFO, getClass().getSimpleName(), "Nenhum administrador encontrado para notificar");
        }

        List<String> emailsDiretores = dao.buscarEmailPorCargo("diretor");

        if (!emailsDiretores.isEmpty()) {
            String assunto = "Dados da sua instituição foram atualizados";
            String conteudo = montarMensagemDiretor(resultadoETL);
            enviarEmails(emailsDiretores, assunto, conteudo);
        } else {
            logs.log(LogLevel.INFO, getClass().getSimpleName(), "Nenhum diretor encontrado para notificar");
        }
    }

    public void enviarEmails(List<String> emails, String assunto, String conteudo) {
        for (String email : emails) {
            if (email != null) {
                emailService.enviar(email, assunto, conteudo);
            }
        }
    }

    private String montarMensagemAdmin(ResultadoETL etlResultado) {
        String bases = "";

        for (String base : etlResultado.getBasesProcessadas()) {
            bases += "   - " + base + "\n";
        }

        return """
            O processo de ETL foi finalizado.
        
            Duração: %.2fs
        
            Bases processadas:
            %s
            """.formatted(
                        etlResultado.getDuracaoSegundos(),
                        bases
        );
    }

    private String montarMensagemDiretor(ResultadoETL resultadoETL) {
        return "Os dados da sua instituição foram atualizados no sistema Conexão Acadêmica.\n\n" +
                "Acesse a plataforma para visualizar as informações mais recentes.";
    }

}
