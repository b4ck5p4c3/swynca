
export default function isAuthorized(req: Request) : boolean {
    const authToken = (req.headers.get("authorization") || '').split("Bearer ").at(1);
    return authToken === process.env.TELEGRAM_BOT_BEARER_TOKEN;
}