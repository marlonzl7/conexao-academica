package com.academica.conexao.infra.email.service;

import com.academica.conexao.infra.log.LogLevel;
import com.academica.conexao.infra.log.LogsManager;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

import java.util.Date;
import java.util.Properties;

public class EmailService {

    private final LogsManager logsManager;

    private final String host = System.getenv("SMTP_HOST");
    private final String port = System.getenv("SMTP_PORT");
    private final String username = System.getenv("SMTP_USER");
    private final String password = System.getenv("SMTP_PASS");
    private final String from = System.getenv("SMTP_FROM");

    private final Session session;

    public EmailService(LogsManager logsManager) {
        this.logsManager = logsManager;

        Properties props = new Properties();

        props.put("mail.smtp.host", host);
        props.put("mail.smtp.port", port);
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");

        this.session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });
    }

    public void enviar(String destinatario, String assunto, String conteudo) {
        try {
            MimeMessage msg = new MimeMessage(session);

            msg.setFrom(new InternetAddress(from));

            msg.setRecipients(
                    Message.RecipientType.TO,
                    InternetAddress.parse(destinatario)
            );

            msg.setSubject(assunto);
            msg.setSentDate(new Date());

            msg.setText(conteudo);

            Transport.send(msg);

            logsManager.log(LogLevel.INFO, getClass().getSimpleName(), "Email enviado para: " + destinatario);
        } catch (MessagingException e) {
            logsManager.log(LogLevel.ERROR, getClass().getSimpleName(), "Erro ao enviar email: " + e.getMessage());
        }
    }

}
