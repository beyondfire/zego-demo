import { ZegoExpressEngine } from 'zego-express-engine-webrtc';
import { service } from '../utils/request';
import con from '../utils/console';
const appID = 1739272706;
const server = 'wss://webliveroom-test.zego.im/ws';
const userID = 'sampleUser' + new Date().getTime();

export const zg = new ZegoExpressEngine(appID, server);
// const { getVersion } = zg;
// checkSystemRequirements()
console.log(zg.getVersion());
// console.log(getVersion());
// console.log(checkSystemRequirements);
// zg.checkSystemRequirements().then(el => {
//     console.log('系统支持信息');
//     console.log(el);
// })
zg.enumDevices().then(el => {
    console.log('硬件信息');
    console.log(el);
})
// zg.createStream({
//     camera: {
//         video: false,
//         audio: true,
//     },
// }).then( el => {
//     console.log('查看数据源')
//     console.log(el);
// })

// 房间状态更新回调
zg.on('roomStateUpdate', (roomID,state,errorCode,extendedData) => {
    if (state === 'DISCONNECTED') {
        // 与房间断开了连接
        con.warning('房间断开连接');
        console.log(roomID);
        console.log(extendedData);
    }

    if (state === 'CONNECTING') {        
        // 与房间尝试连接中 
        con.debug('房间连接中。。。。。。。。');
    }

    if (state === 'CONNECTED') {
        // 与房间连接成功
        console.log(extendedData);
        con.success('房间连接成功');
    }
})

// 用户状态更新回调
zg.on('roomUserUpdate', (roomID, updateType, userList) => {
    con.mark('----------------------------');
    console.log(roomID);
    console.log(updateType);
    console.log(userList);
});

// 流状态更新回调
zg.on('roomStreamUpdate', async (roomID, updateType, streamList, extendedData) => {
    if (updateType === 'ADD') {
        // 流新增，开始拉流
        const stremID = streamList[0].streamID;
        console.log(stremID);
        pullStream(stremID);
    } else if (updateType === 'DELETE') {
        // 流删除，停止拉流
    }
});
zg.on('playerStateUpdate', result => {
    // 拉流状态更新回调
    con.success(`拉流结果`);
    console.log(result);
})

zg.on('playQualityUpdate', (streamID,stats) => {
    // 拉流质量回调
    con.mark(`拉流质量：${stats}`);
})

zg.on('publisherStateUpdate', result => {
    // 推流状态更新回调
    con.success(`推流结果`);
    console.log(result);
})

zg.on('publishQualityUpdate', (streamID, stats) => {
    // 推流质量回调
    con.mark(`推流质量：${stats}`);
})

//登陆房间；
export const loginRoom = async (roomID) => {
    const token = await service({
        method:'get',
        url:'https://wsliveroom-alpha.zego.im:8282/token',
        params:{
            'app_id': appID,
            'id_name': userID  
        }
    }).then(token => token.data);
    con.debug('checkout token!!!');
    con.debug(token);
    const result = await zg.loginRoom(
        roomID, 
        token, 
        { 
            userID: userID,
            userName: userID
        },
        {
            userUpdate: true,
            isUserStatusNotify: true
        }
        );
    con.debug('checkout!!!');
    con.debug(result);
    // pullStream();
}

let localStream = null;
//呼叫推流
export const pushStream = async (streamID) => {
    // 调用 createStream 接口后，需要等待 ZEGO 服务器返回流媒体对象才能执行后续操作
    localStream = await zg.createStream({camera :{audio:true,video:true}});
    // 获取页面的 audio 标签
    const localAudio = document.getElementById('local-preview');
    // stream 为MediaStream对象，开发者可通过赋值给video或audio的srcObject属性进行渲染
    localAudio.srcObject = localStream;

    zg.startPublishingStream(streamID, localStream);
}
//呼叫拉流
export const pullStream = async (stremID) => {
    const remoteStream = await zg.startPlayingStream(stremID);
    // 获取页面的 audio 标签
    const remoteAudio = document.getElementById('remote-preview');
    // remoteAudio为本地<video>或<audio>对象
    remoteAudio.srcObject = remoteStream;
}
//挂断停止
export const stopStream = async (streamID) => {
    zg.stopPublishingStream(streamID);
    zg.destroyStream(localStream);
    // zg.stopPlayingStream(streamID);
}

export const outRoom = async (roomID) => {
    zg.logoutRoom(roomID)
}