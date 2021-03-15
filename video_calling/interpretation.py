import cv2 
import numpy as np
import os
from object_detection.utils import label_map_util
from object_detection.utils import visualization_utils as viz_utils
from object_detection.builders import model_builder
import tensorflow as tf
from object_detection.utils import config_util
from object_detection.protos import pipeline_pb2
from google.protobuf import text_format
from django.http import JsonResponse
import time
import base64
from PIL import Image
from numpy import asarray
from operator import itemgetter

WORKSPACE_PATH = 'video_calling/Tensorflow/workspace'
ANNOTATION_PATH = WORKSPACE_PATH+'/training_demo/annotations'
MODEL_PATH = WORKSPACE_PATH+'/training_demo/models'
CONFIG_PATH = MODEL_PATH+'/my_ssd_mobilenet_v2_fpnlite/pipeline.config'
CHECKPOINT_PATH = MODEL_PATH+'/my_ssd_mobilenet_v2_fpnlite/'

# Load pipeline config and build a detection model
configs = config_util.get_configs_from_pipeline_file(CONFIG_PATH)
detection_model = model_builder.build(model_config=configs['model'], is_training=False)

@tf.function
def detect_fn(image):
    print('inside detect_fn')
    image, shapes = detection_model.preprocess(image)
    print('pre-processing')
    prediction_dict = detection_model.predict(image, shapes)
    print('prediction')
    detections = detection_model.postprocess(prediction_dict, shapes)
    print('post-processing')

    return detections

def interpret(request): 
    print('AJAX Request received')
    dataURL = request.POST.get('dataURL')
    dataURL = dataURL.replace("data:image/jpeg;base64,", "")
    dataURL = dataURL.replace(" ", "+")
    
    base64_img_bytes = dataURL.encode('utf-8')
    with open('static/images/captured_image.jpeg', 'wb') as file_to_save:
        decoded_image_data = base64.decodebytes(base64_img_bytes)
        file_to_save.write(decoded_image_data)
    print('Saving img')
	
    image = Image.open('static/images/captured_image.jpeg')
    image_np = asarray(image)
    print('opening img as array')

    category_index = label_map_util.create_category_index_from_labelmap(ANNOTATION_PATH + '/label_map.pbtxt')
    
    # Restore checkpoint
    ckpt = tf.compat.v2.train.Checkpoint(model=detection_model)
    ckpt.restore(os.path.join(CHECKPOINT_PATH, 'ckpt-21')).expect_partial()
    print('restoring checkpoint')
        
    input_tensor = tf.convert_to_tensor(np.expand_dims(image_np, 0), dtype=tf.float32)
    detections = detect_fn(input_tensor)
    print('completed detection')

    num_detections = int(detections.pop('num_detections'))
    detections = {key: value[0, :num_detections].numpy()
                for key, value in detections.items()}
    detections['num_detections'] = num_detections

    # detection_classes should be ints.
    detections['detection_classes'] = detections['detection_classes'].astype(np.int64)    

    label_id_offset = 1
    image_np_with_detections = image_np.copy()  

    max_score = max(list(detections['detection_scores']))
    indexes = [k for k,v in enumerate(detections['detection_scores']) if (v == max_score)]
    print('getting max score')

    num_entities = len(indexes)

    class_id = itemgetter(*indexes)(detections['detection_classes']) + label_id_offset
    scores = itemgetter(*indexes)(detections['detection_scores'])

    class_name = str(category_index[class_id]['name'])     
    print('getting class name')   
    
    data = {
        "caption" : class_name
    }

    return JsonResponse(data)


# def demo(request):
#     data = {
#         "message" : "Hello"
#     }

#     return JsonResponse(data)
