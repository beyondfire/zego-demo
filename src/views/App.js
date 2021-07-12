import './App.css';
import { pushStream, loginRoom, stopStream, outRoom } from '../common/zgo';
import  {useState} from 'react';

function App() {
  const [streamID, setStreamID] = useState(`webStream-${new Date().getTime()}`);
  const [roomID, setRoomID] = useState('000001');
  return (
    <div className="App">
      <header className="App-header">        
        <div className = "room-info">
          <div className = 'input-box'>
            <span className='input-title'>StreamID</span>
            <input value={streamID} onChange={el => setStreamID(el.target.value)} />
          </div>
          <div className = "input-box">
            <span className='input-title'>房间号</span>
            <input value={roomID} onChange={el => setRoomID(el.target.value)} />
          </div>
          <button className = "join-room info-btn" onClick = {() => loginRoom(roomID)}>进入房间</button>
          <button className = "out-room info-btn" onClick = {() => outRoom(roomID)}>离开房间</button>
        </div>
        <div className = "preview">
          <video id="remote-preview" className = "remote" autoPlay="autoplay" muted playsInline></video>
          <video id="local-preview" className = "local" autoPlay="autoplay" muted playsInline></video>
        </div>
        <div className = "handle">
          <button className = "call handle-btn" onClick = {() => pushStream(streamID)}>呼叫</button>
          <button className = "off handle-btn" onClick = {() => stopStream(streamID)}>挂断</button>
        </div>
      </header>
    </div>
  );
}

export default App;
