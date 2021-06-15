# <p align="center">HastAkshar</p>

## <p align="center">A video calling web application with Indian Sign Language Interpretation</p>
One of the biggest things which has been noticed during the COVID-19 pandemic is how family and friends have been keeping in contact with the help of multiple video meeting platforms and apps. These social interactions have been so important during this period to compensate the lack of physical contact and have helped to keep spirits high during a truly difficult time for us all. COVID-19 has also forced many people to work from their homes. In-person interactions are a necessity at the workplace, without which information is lost or misinterpreted when just using written and verbal communication. However, there is a great digital divide, which was brought by this shift in technology. Those who are deprived from verbal communication, the deaf and mute, face difficulties using this technology. HastAkshar will come to their aid. HastAkshar will interpret limited ISL cues and transcribe these non-verbal cues. 

### Problem Definition
HastAkshar is a video calling web-application with the ability to interpret Indian Sign-Language (ISL) cues and transcribe these non-verbal cues to verbal cues. Hence it understands defined ISL for the users who don’t know the language themselves and provide a closed captioning for users, enabling convenient conversation for all parties.<br>

### Features of the Project:
- **Video Calling Service:** This is the base feature of our service. Network connection would play an important role here. Stable Internet connectivity would ensure uninterrupted communication between the users with minimum latency. Also, camera, microphone and speakers are necessary accessories for a smooth conversation between the two users.
- **ISL Interpretation Service:** The application aims at providing video calling service to everyone, including individuals who are mute or deaf. The application will detect ISL cues with input from a camera and transcribe them into verbal cues for users who are unable to comprehend sign-languages. For this feature, use of HD camera is recommended as a poor quality camera can hamper the interpretation model.

### Components of the Application
The web application is built using Django – an open-sourced web framework that allows rapid development of the application.<br>
- **Video Calling Service (VCS):** The VCS makes use of Socket.IO for communication between the users and it needs to function asynchronously to ensure support to critical functionality of the application. The default PeerCloud service is used for establishing connections between any two users. Once the users are inside the room using the generated ‘roomId’, they can access the calling interface that enables chat and use the ISL Interpretation service on a successful call connection. The messages are sent across by broadcasting a Socket.IO event within the room.  All the button toggles are implemented using JavaScript.
- **ISL Interpretation Service (SLS):** The SLS module’s activities are primarily supported by a deep learning model which is configured using TensorFlow models. This is done by using SSD MobileNet and TensorFlow’s object detection libraries. Feature extraction is done using ‘ssd_mobilenet_v2_fpb_keras’ function with ‘RELU_6’ activation function. A detailed configuration of the model is stored in a configuration file which is accessed when the model is trained. It also makes use of depthwise separable convolutions to construct an efficient model for 15 classes (one per ISL gesture). The custom dataset used for training this model includes 40 labeled images per ISL gesture split in 4:1 ratio for training and the latter for testing purposes. These images have been contributed by different individuals with no particular background filtering or setup and without any image data augmentation technique. Such conditions will help in the development of a diverse dataset which will improve the model performance when the application is deployed in a real-time environment. The images were labeled using ‘labelImg’ which is an open-source tool that generates XML files in PASCAL VOC format. The XML file consists of the details of the image such as the bounding box points, labels, etc. The model is trained until 30,000 epochs, a point where it achieves a minimum classification loss at a learning rate of 0.0286. An eventual regularized loss of 0.05298 was recorded at the model training termination. Once the model is tested it is exported as an API so that it can be invoked by the application with a request call when the SLS button is switched on for use.

<p align="center"><img width="50%" height="100%" src="https://github.com/rkasale28/BE-Project/blob/main/Readme%20Images/img1.png"></p>

### Implementation
<p align="center"><img width="50%" height="100%" src="https://github.com/rkasale28/BE-Project/blob/main/Readme%20Images/img2.png"></p>

### Results
- With the followed work pipeline, 15 ISL gestures including double-handed ones can be interpreted over a live video call between users
- The model was trained for 30,000 epochs at a learning rate of 0.028
- The total loss recorded in the model training process was 0.172
- While using ISL interpretation, the network latency of the overall application is recorded to be less than 2 seconds which suggests faster communication
- The average response time for the interpretation process from image capture to displaying response on-screen is 0.214 seconds
- For measuring the accuracy of the object detection model, metrics such as Recall, Precision, Mean Average Precision (mAP), and Intersection over Union (IoU) is used. Below are the tabulated results:

| Metric Used  | Metric Score (ratio) |
| :-------------: |:--------------:|
| Average Precision (area = large) | 0.853 |
| Average Recall (area = large) | 0.871 |
