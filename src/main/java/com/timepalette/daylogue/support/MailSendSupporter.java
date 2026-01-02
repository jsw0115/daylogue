package com.timepalette.daylogue.support;

import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component
public class MailSendSupporter {

    private final JavaMailSender mailSender;
    private final String from = "";

    public MailSendSupporter(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * 메일 발송
     * @since 2025.12.28
     * @param to
     * @param subject
     * @param htmlBody
     * @return void
     */
    public void send(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");
            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
        } catch (Exception e) {
            // 운영에서는 재시도 큐/비동기(Outbox)로 빼는 걸 권장
            throw new IllegalStateException("메일 발송 실패", e);
        }
    }
}
