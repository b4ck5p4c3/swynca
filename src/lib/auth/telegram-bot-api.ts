export function isAuthorized(req: Request) : boolean {
    const authToken = (req.headers.get("authorization") || '').split("Bearer ").at(1);
    return authToken === process.env.TELEGRAM_BOT_BEARER_TOKEN;
}

export default async function authorizedOnlyRequest(request: Request, requestProcessor: Function, params = {}) {
    if (isAuthorized(request)) {
        return requestProcessor(request, params);
    } else {
        return new Response(JSON.stringify({ code: 401, message: 'Unauthorized'}), { status: 401 });
    }
}