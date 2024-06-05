import ml5 from 'ml5'

export default (p5) => {
    // Classifier Variable
    let classifier;
    // Model URL
    let imageModelURL = 'https://teachablemachine.withgoogle.com/models/kXD1UtbaY/';

    // Video
    let video;
    let flippedVideo;
    // To store the classification
    let label = "";
    let img;
    // Load the model first
    p5.preload = () => {
        classifier = ml5.imageClassifier(imageModelURL + 'model.json');
        img = p5.loadImage('/logo512.png');
    }

    p5.setup = () => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight); 

        var constraints = {
            audio: false,
            video: {
                facingMode: "environment"
            }
        };
        video = p5.createCapture(constraints);
        video.size(400, 660);
        video.hide();

        flippedVideo = ml5.flipImage(video)
        // Start classifying
        p5.classifyVideo();
    }

    p5.draw = () => {
        p5.background(0);
        // Draw the video
        p5.image(video, 0, 0);
        p5.tint(0x36, 0xf7, 0x5e, 127);

        // Draw the label
        p5.fill(255);
        p5.textSize(30);
        p5.textAlign(p5.CENTER);
        p5.text(JSON.stringify(p5.props) + " " + label, p5.width / 2, p5.height - 60);
        p5.image(img, 10, p5.height - 100, 100, 52);
    }

    // Get a prediction for the current video frame
    p5.classifyVideo = () => {
        flippedVideo = ml5.flipImage(video)
        classifier.then(cls => cls.classify(flippedVideo, p5.gotResult));
    }

    // When we get a result
    p5.gotResult = (error, results) => {
        // If there is an error
        if (error) {
            console.error(error);
            return;
        }
        // The results are in an array ordered by confidence.
        // console.log(results[0]);
        if (results[0].confidence > 0.85) {
            label = results[0].label;
        }
        else {
            label = "...";
        }
        flippedVideo.remove();
        // Classifiy again!
        p5.classifyVideo();
        if (label === p5.props.artifactId) {
            p5.props.handleFound();
        }
    }

    p5.touchStarted = () => {
        // prevent default scrolling behavior 
        return false;
      }
}
