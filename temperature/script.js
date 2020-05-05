var xmlns = "http://www.w3.org/2000/svg",
  xlinkns = "http://www.w3.org/1999/xlink",
  select = function(s) {
    return document.querySelector(s);
  },
  selectAll = function(s) {
    return document.querySelectorAll(s);
  },
    liquid = selectAll('.liquid'),
    tubeShine = select('.tubeShine'),
    label = select('.label'),
    follower = select('.follower'),
    dragger = select('.dragger'),
    dragTip = select('.dragTip'),
    minDragY = -380,
    liquidId = 0,
    step = Math.abs(minDragY/100),
    snap = Math.abs(minDragY/10),
    followerVY = 0
  

TweenMax.set('svg', {
  visibility: 'visible'
})

TweenMax.set(dragTip, {
 transformOrigin:'20% 50%'
})

var tl = new TimelineMax()
tl.staggerTo(liquid, 0.7, {
 x:'-=200',
 ease:Linear.easeNone,
 repeat:-1
},0.9)

tl.time(100);

document.addEventListener("touchmove", function(event){
    event.preventDefault();
});
Draggable.create(dragger, {
 type:'y',
 bounds:{minY:minDragY, maxY:0},
 onDrag:onUpdate,
 throwProps:true,
 throwResistance:2300,
 onThrowUpdate:onUpdate,
 overshootTolerance:0,
 snap:function(value){
  //Use this to snap the values to steps of 10
  //return Math.round(value/snap) * snap
 }
})

function onUpdate(){
 liquidId = Math.abs(Math.round(dragger._gsTransform.y/step));

 label.textContent = liquidId + '°';
 TweenMax.to(liquid, 1.3, {
  y:dragger._gsTransform.y*1.12,
  ease:Elastic.easeOut.config(1,0.4)
 })
 
}

TweenMax.to(follower, 1, {
 y:'+=0',
 repeat:-1,
 modifiers:{
  y:function(y, count){
  followerVY += (dragger._gsTransform.y - follower._gsTransform.y) * 0.23;
   followerVY *= 0.69;
   return follower._gsTransform.y + followerVY; 
  }
 }
})

TweenMax.to(dragTip, 1, {
 rotation:'+=0',
 repeat:-1,
 modifiers:{
  rotation:function(rotation, count){
   return rotation-followerVY
  }
 }
})

TweenMax.to(label, 1, {
 y:'+=0',
 repeat:-1,
 modifiers:{
  y:function(y, count){
   return y-followerVY * 0.5
  }
 }
})


TweenMax.to(dragger, 1.4, {
 y:minDragY/2,
 onUpdate:onUpdate,
 ease:Expo.easeInOut
})


//ScrubGSAPTimeline(tl);


        var WebSocket_Buffer=new Uint8Array(2);
		var isPageMove=false;
        $(document).ready(function(){
            if(!isWebSocketConnected)
            {
                WebSocket_Connect();
            }

            if(isWebSocketConnected)
            {
                alert("Connected...");
            }
        });


        var WAS_PORTNUM="9000";
        var WebSocket_URL= "ws://220.69.244.118:"+WAS_PORTNUM;
        var ws;
        var isWebSocketConnected=false; // 페이지를 벗어날때, WebSocket종료시 엣지브라우저에서 'WebSocket Error'가 일어나는 것을 해결하기 위한 데이터
        var isWindowUnload=false;
        var isToldError_when_occured=false;
        window.onbeforeunload=function(e){
            isWindowUnload=true;
            isPageMove=true;
            ws.close();
            return '페이지를 나가시겠습니까?';
        };

        function WebSocket_Connect()
        {
            ws=new WebSocket(WebSocket_URL);
            ws.onopen = WebSocket_onOpen;
            ws.onmessage = Websocket_onMessage;
            ws.onclose = WebSocket_onClose;
            ws.onerror = WebSocket_onError;
            isToldError_when_occured=false;
        }

        function WebSocket_onOpen(e)
        {
            //txtRecv.append( "connected<br>" );
            isWebSocketConnected=true;
            //alert("connected");
            
                alert("보드와 연결되었습니다.");
        }

        var reader = new FileReader();
        reader.addEventListener("loadend", function(e) {
                // if the server sent binary array. (function : Websocket_onMessage(e))
                var recvBuf=new Uint8Array(e.srcElement.result);

            console.log(-recvBuf[0]);
            dragger._gsTransform.y=-recvBuf[0]; // 단위 : 5 (예 : -110=29도)
            onUpdate();
        });

        function Websocket_onMessage(e)
        {
            if(e.data instanceof Blob)
            reader.readAsArrayBuffer(e.data);
            else
            {
                // if the server sent string(message).
                alert(e.data);
            }
        }

        function WebSocket_onClose(e)
        {
            isWebSocketConnected=false;
            //alert("closed");

            
            if(!isPageMove)
				alert("임베디드 보드와 연결이 끊어졌습니다.\n컴퓨터와 임베디드 보드의 인터넷 연결을 확인하세요.")
        }

        function WebSocket_onError(e)
        {
            if(!isWebSocketConnected && !isToldError_when_occured)
            {
                
                if(!isPageMove)
				    alert("임베디드 보드와 연결할 수 없습니다.\n컴퓨터와 임베디드 보드의 인터넷 연결을 확인하세요.");
                isToldError_when_occured=true;
            }
            isWebSocketConnected=false;
        }