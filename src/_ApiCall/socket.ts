const createPrivateSocket = async (token: string|null,chatId: string): Promise<WebSocket> => {
    const wsPrivateUrl = `ws://13.60.42.120/ws/private/${chatId}`;
    return new WebSocket(`${wsPrivateUrl}/${token}/`);
}



  
export {
    createPrivateSocket,
}