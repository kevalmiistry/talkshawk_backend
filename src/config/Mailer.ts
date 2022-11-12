import nodemailer from 'nodemailer'

const sendMail = async (email: string, authToken: string) => {
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
        let url = `http://localhost:3000/verifyemail/${authToken}`

        let info = await transporter.sendMail({
            from: '"Test TalkShawk" <emailverify.wasteaid@gmail.com>', // sender address
            to: `${email}`, // list of receivers
            subject: 'Test TalkShawk Email Verification', // Subject line
            // text: "Hello world?", // plain text body
            html: `<div style="font-family: \'Nirmala UI\'; width: 100%; color: #444; padding: 1em;"><div style="background: #fff; border-radius: 10px; margin: 4em auto; width: fit-content;"><p style="text-align: center;">We are glad you chose to join TalkShawk :D</p><p style="text-align: center;">Click below Button to verify your email!{' '}</p><a style="display: block; margin: auto; width: fit-content; text-decoration: none; background-color: #a0e4b0; padding: 4px 10px; color: #fff; border-radius: 4px;" href="${url}">Verify Email</a></div></div>;`,
        })
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}
export default sendMail
