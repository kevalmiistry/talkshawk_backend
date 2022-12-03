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
    <p style="text-align: left; margin-top: 3rem;">Hi 👋, ${Name} (@${UserName})</p>
    <p style="text-align: left; margin-top: 3rem;">Thank you for Signing up at TalkShawk! 😀</p>
    <p style="text-align: left;">Click on the button below to verify your email.</p>
    <a style="display: block; margin: 1px; width: fit-content; text-decoration: none; background-color: teal; padding: 4px 10px; color: #fff; border-radius: 4px;"
        href="${url}">Verify Email</a>
    <p style="text-align: left;">Or click the link below to verify your email.</p>
    <a href="${url}">${url}</a>
    <p style="text-align: left; font-size: 14px; margin-top: 3rem;">&copy 2022 TalkShawk. All rights Reserved.</p>
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
    OTP: string
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
    style="border-radius: 15px; margin:0; background: #111;font-family: 'Nirmala UI'; height:100vh; color: #fff; padding: 1em; font-weight: 600; font-size: 1.5em;">
    <img style="display: block; margin: auto; width: 60%; margin-top: 3rem;"
        src="https://firebasestorage.googleapis.com/v0/b/talkshawk-4d53a.appspot.com/o/images%2Ftalkshawk_full_logo.png?alt=media&token=dc43c3c1-ea20-4307-b3da-e237ca834681"
        alt="talkshawk logo" />
    <p style="text-align: center; margin-top: 3rem;">Forget your password?</p>
    <p style="text-align: center; margin-top: 3rem;">We received a request to reset your password for your account.</p>
    <p style="text-align: center; margin-top: 3rem;">Your OTP:&nbsp; <span style="font-size: 2.1rem;">${OTP}</span></p>
    <p style="text-align: center;">Copy your OTP and Click below button to reset the password.</p>

    <a style="display: block; margin: auto; width: fit-content; text-decoration: none; background-color: teal; padding: 4px 10px; color: #fff; border-radius: 4px; color:#111"
        href="${url}">Reset Password</a>
    <p style="text-align: center; font-size: 1rem; margin-top: 3rem;">&copy 2022 TalkShawk. All rights Reserved.</p>
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
