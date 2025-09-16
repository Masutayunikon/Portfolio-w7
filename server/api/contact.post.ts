// server/api/contact.post.ts  (ou .ts selon ta convention)
import nodemailer from 'nodemailer'
import type { SendMailOptions } from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import path from 'path'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const body = await readBody<{
        email?: string
        subject?: string
        message?: string
        name?: string
    }>(event)

    const fromEmail = body?.email?.trim()
    const subject   = body?.subject?.trim()
    const message   = body?.message?.trim()
    const name      = body?.name?.trim() || fromEmail || 'Anonymous'

    if (!fromEmail || !subject || !message) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing required fields: email, subject, message',
        })
    }

    // créer le transporter (SECURE si port 465)
    const port = Number(config.smtp.port)
    const transporter = nodemailer.createTransport({
        host: config.smtp.host,
        port,
        secure: port === 465,
        auth: {
            user: config.smtp.user,
            pass: config.smtp.pass,
        },
    })

    interface MailOptionsWithTemplate extends SendMailOptions {
        template?: string
        context?: Record<string, any>
    }

    // config Handlebars (templates dans server/mails)
    const templatesDir = path.resolve(process.cwd(), 'server/mails')
    transporter.use(
        'compile',
        hbs({
            viewEngine: {
                extname: '.hbs',
                defaultLayout: undefined,
                layoutsDir: templatesDir,
                partialsDir: templatesDir,
            },
            viewPath: templatesDir,
            extName: '.hbs',
        })
    )

    try {
        const info =  transporter.sendMail({
            from: config.smtp.fromEmail,   // expéditeur "technique"
            to:   config.smtp.toEmail,     // où tu reçois les messages
            replyTo: fromEmail,            // pour répondre directement à l'auteur
            subject: `💌 New message: ${subject}`,
            template: 'new-message',       // server/mails/new-message.hbs
            context: {
                name,
                subject,
                message,
            },
        } as MailOptionsWithTemplate)

        return { ok: true, info: info }
    } catch (err: any) {
        console.error('Mailer error:', err)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to send email',
        })
    }
})
