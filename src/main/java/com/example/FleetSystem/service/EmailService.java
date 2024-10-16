package com.example.FleetSystem.service;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import javax.mail.internet.MimeMessage;


@Service
@Log4j2
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;
//    @Value("${spring.redirectLink}")
//    private String redirectLink;
    @Value("${spring.mail.username}")
    private String sender;

    public void sendEmail(String to, String subject, String supplier, String invoiceMonth, String invoiceType) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setFrom(sender);
            helper.setText("<html>\n" +
                    "<head>\n" +
                    "    <meta charset=\"UTF-8\">\n" +
                    "    <title>Invoice approval request from finance team</title>\n" +
                    "</head>\n" +
                    "<body>\n" +
                    "    <p>Below are the details of the invoice:</p>\n" +
                    "    <p>Supplier: \"" + supplier + "\"</p>\n" +
                    "    <p>Invoice Month: \"" + invoiceMonth + "\"</p>\n" +
                    "    <p>Invoice Type: \"" + invoiceType + "\"</p>\n" +
                    "    <p>To view more details, please click the link below:</p>\n" +
//                    "    <a href=\"" + redirectLink + "\">Click here to view the invoice details</a>\n" +
                    "</body>\n" +
                    "</html>", true);
            javaMailSender.send(message);
        }catch (Exception e){
            e.printStackTrace();
            throw new RuntimeException("Error while sending mail"+e.getMessage());
        }

    }


//    public void sendHtmlEmail(String to,String subject,String emailTemplate,Map<String,Object> model) {
//        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
//        MimeMessageHelper helper;
//
//        try {
//            helper = new MimeMessageHelper(mimeMessage, true);
//            helper.setTo(to);
//            helper.setSubject(subject);
//            helper.setFrom(sender);
//            Template t = config.getTemplate(emailTemplate);
//            String html = FreeMarkerTemplateUtils.processTemplateIntoString(t, model);
//
//            helper.setText(html, true);
//
//            javaMailSender.send(mimeMessage);
//        } catch (Exception e) {
//            // Handle exceptions
//            e.printStackTrace();
//            log.error(e.getMessage());
//        }
//    }
//
//    public void sendHtmlEmail(String[] to, String[] cc, String subject, String emailTemplate, Map<String, Object> model) {
//        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
//        MimeMessageHelper helper;
//
//        try {
//            helper = new MimeMessageHelper(mimeMessage, true);
//            helper.setSubject(subject);
//            helper.setFrom(sender);
//
//            // Set recipients
//            if (to != null && to.length > 0) {
//                helper.setTo(to);
//            } else {
//                throw new IllegalArgumentException("Recipient list is empty");
//            }
//
//            // Set CC
//            if (cc != null && cc.length > 0) {
//                helper.setCc(cc);
//            }
//
//            Template t = config.getTemplate(emailTemplate);
//            String html = FreeMarkerTemplateUtils.processTemplateIntoString(t, model);
//
//            helper.setText(html, true);
//
//            javaMailSender.send(mimeMessage);
//        } catch (Exception e) {
//            // Handle exceptions
//            e.printStackTrace();
//            log.error(e.getMessage());
//        }
//    }



}
