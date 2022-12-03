import nodemailer from 'nodemailer'
import { UserData } from '../@types'

const sendMail = async (
    email: string,
    authToken: string,
    Name: string,
    UserName: string
) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: +process.env.MAIL_PORT!,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_ID,
                pass: process.env.MAIL_PASS,
            },
        })

        // send mail with defined transport object
        let url = `${process.env.CLIENT_URL}/verifyemail/${authToken}`
        const htmlBody = `<div
    style="border-radius: 15px; margin:0; background: #000;font-family: 'Nirmala UI'; height:100vh; color: #fff; padding: 1em;  font-size: 16px;">
    <img style="display: block; margin: 0; width: 60%; margin-top: 3rem;"
        src="https://firebasestorage.googleapis.com/v0/b/talkshawk-4d53a.appspot.com/o/images%2Ftalkshawk_full_logo-removebg-preview.png?alt=media&token=2a9f6532-48b1-4885-91b2-17559338296d"
        alt="talkshawk logo" />
    <p style="color: #fff; margin-top: 3rem;">Hi 👋, ${Name} (@${UserName})</p>
    <p style="color: #fff; margin-top: 3rem;">Thank you for Signing up at TalkShawk! 😀</p>
    <p style="color: #fff;">Click on the button below to verify your email.</p>
    <a style="display: block; margin: 1px; width: fit-content; text-decoration: none; background-color: teal; padding: 4px 10px; color: #fff; border-radius: 4px;"
        href="${url}">Verify Email</a>
    <p style="color: #fff;">Or click the link below to verify your email.</p>
    <a href="${url}">${url}</a>
    <p style="color: #fff; font-size: 14px; margin-top: 3rem;">© ${new Date().getFullYear()} TalkShawk. All rights Reserved.</p>
</div>`

        let info = await transporter.sendMail({
            from: '"TalkShawk" <emailverify.wasteaid@gmail.com>', // sender address
            to: `${email}`, // list of receivers
            subject: 'TalkShawk Email Verification', // Subject line
            // text: "Hello world?", // plain text body
            html: htmlBody,
        })
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

export default sendMail

export const sendMailForget = async (
    email: string,
    authToken: string,
    OTP: string,
    Name: string,
    UserName: string
) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: +process.env.MAIL_PORT!,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_ID,
                pass: process.env.MAIL_PASS,
            },
        })

        // send mail with defined transport object
        let url = `${process.env.CLIENT_URL}/forgetpassword/${authToken}`

        const htmlString = `<div
    style="border-radius: 15px; margin:0; background: #000;font-family: 'Nirmala UI'; height:100vh; color: #fff; padding: 1em;  font-size: 16px;">
    <img style="display: block; margin: 0; width: 60%; margin-top: 3rem;"
        src="https://firebasestorage.googleapis.com/v0/b/talkshawk-4d53a.appspot.com/o/images%2Ftalkshawk_full_logo-removebg-preview.png?alt=media&token=2a9f6532-48b1-4885-91b2-17559338296d"
        alt="talkshawk logo" />
    <p style="margin-top: 3rem; color:#fff;">Hi 👋, ${Name} (@${UserName})</p>
    <p style="color:#fff;">Forget your password?</p>
    <p style="color:#fff;">We received a request to reset your password for your account.</p>
    <p style="color:#fff;">(NOTE: Don't share your OTP with anyone)</p>
    <p style="color:#fff;">Copy your OTP and click below buttonor a link to reset the password.</p>
    <p style="color:#fff;">Your OTP:&nbsp; <span style="font-size: 1.75rem; font-weight:600">${OTP}</span></p>
    <a style="display: block; margin: 1px; width: fit-content; text-decoration: none; background-color: teal; padding: 4px 10px; color: #fff; border-radius: 4px;"
        href="#">Verify Email</a>
    <br>
    <a href="${url}">${url}</a>
    <p style="color:#fff;text-align: left; font-size: 14px; margin-top: 3rem;">© ${new Date().getFullYear()} TalkShawk. All rights
        Reserved.</p>
</div>`

        let info = await transporter.sendMail({
            from: '"TalkShawk" <emailverify.wasteaid@gmail.com>', // sender address
            to: `${email}`, // list of receivers
            subject: 'TalkShawk Forget Password', // Subject line
            // text: "Hello world?", // plain text body
            html: htmlString,
        })
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}
