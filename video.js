let noseX, noseY;

(() => {
    'use strict';
    let localStream;
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const minConfidence = 0.2;
    const VIDEO_WIDTH = 320;
    const VIDEO_HEIGHT = 240;
    const frameRate = 20;
    
    // preview screen
    navigator.mediaDevices.getUserMedia({video: true, audio: true})
    .then(vid => {
        video.srcObject = vid;
        localStream = vid;
        const intervalID = setInterval(async () => {
            try {
                // ctx.scale(-1, 1);
                // ctx.translate(-VIDEO_WIDTH, 0);
                // ctx.restore();
                estimateMultiplePoses();
            } catch (err) {
                clearInterval(intervalID)
                setErrorMessage(err.message)
            }
        }, Math.round(1000 / frameRate))
        return () => clearInterval(intervalID)
    });

    function drawKeypoints(keypoints) {
      for (let i = 0; i < keypoints.length; i++) {
        const keypoint = keypoints[i];
        // Uncomment this line to see the full pose estimation output
        // data structure
        //console.log(`keypoint in drawkeypoints ${keypoint}`);
        const { y, x } = keypoint.position;
        // Here is an example of pulling out just the nose
        if (i == 0) {
          // Just draw the nose point
          drawPoint(y, x, 3);
        }
      }
    }

    function drawSegment(
      pair1,
      pair2,
      color,
      scale
    ) {
      ctx.beginPath();
      ctx.moveTo(pair1.x * scale, pair1.y * scale);
      ctx.lineTo(pair2.x * scale, pair2.y * scale);
      ctx.lineWidth = 2;
      ctx.strokeStyle = color;
      ctx.stroke();
    }

    function drawSkeleton(keypoints) {
        const color = "#FFFFFF";
        const adjacentKeyPoints = posenet.getAdjacentKeyPoints(
          keypoints,
          minConfidence
        );

      adjacentKeyPoints.forEach((keypoint) => {
        drawSegment(
          keypoint[0].position,
          keypoint[1].position,
          color,
          1,
        );
      });
    }

    function drawPoint(y, x, r) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
    }

    // [{"score":0.37104532452683675,"keypoints":[{"score":0.9997352957725525,"part":"nose","position":{"x":158.7479005806177,"y":100.49884484435799}},{"score":0.9993508458137512,"part":"leftEye","position":{"x":187.94918075145915,"y":74.54104412390565}},{"score":0.9993531107902527,"part":"rightEye","position":{"x":140.979136901143,"y":75.16005935372083}},{"score":0.9881107807159424,"part":"leftEar","position":{"x":221.7598454219358,"y":91.83086469479574}},{"score":0.3543190658092499,"part":"rightEar","position":{"x":119.81150823808366,"y":88.82141825753891}},{"score":0.9439630508422852,"part":"leftShoulder","position":{"x":272.53807453793775,"y
    //nose keypoints[0]
  
    let nose;
    let nose_position;


    const estimateMultiplePoses = () => {
        posenet
          .load()
          .then(function(net) {
            //console.log("estimateMultiplePoses .... ");
            return net.estimatePoses(video, {
              decodingMethod: "single-person",
            });
          })
          .then(function(poses) {
            //console.log(`got Poses ${JSON.stringify(poses)}`);
            nose = poses[0]['keypoints'][0];
            nose_position = nose['position'];

            noseX = nose_position['x'];
            noseY = nose_position['y'];
            console.log(`Nose X ${noseX} Y ${noseY}`);

            if (true) {
              // If display then let this run
              canvas.width = VIDEO_WIDTH;
              canvas.height = VIDEO_HEIGHT;
              ctx.clearRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
              ctx.save();
              ctx.drawImage(video, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
              ctx.restore();
              poses.forEach(({ score, keypoints }) => {
                if (score >= minConfidence) {
                  drawKeypoints(keypoints);
                  //drawSkeleton(keypoints);
                }
              });
            }
        });
    }; 

})();





