import tensorflow as tf
import time
from object_detection.utils import label_map_util
from object_detection.utils import visualization_utils as viz_utils
import numpy as np
from PIL import Image
import base64
from operator import itemgetter
from django.http import JsonResponse

PATH_TO_SAVED_MODEL="video_calling/Tensorflow/workspace/training_demo/exported-models/my_model/saved_model"
WORKSPACE_PATH = 'video_calling/Tensorflow/workspace'
ANNOTATION_PATH = WORKSPACE_PATH+'/training_demo/annotations'

detect_fn=tf.saved_model.load(PATH_TO_SAVED_MODEL)
category_index = label_map_util.create_category_index_from_labelmap(ANNOTATION_PATH + '/label_map.pbtxt')

def load_image_into_numpy_array(path):
    return np.array(Image.open(path))

def interpret(request): 
    dataURL = request.POST.get('dataURL')
    try:
        dataURL = dataURL.replace("data:image/jpeg;base64,", "")
        dataURL = dataURL.replace(" ", "+")
        
        base64_img_bytes = dataURL.encode('utf-8')
        with open('static/images/captured_image.jpeg', 'wb') as file_to_save:
            decoded_image_data = base64.decodebytes(base64_img_bytes)
            file_to_save.write(decoded_image_data)
        
        image_np=load_image_into_numpy_array('static/images/captured_image.jpeg')
        
        input_tensor=tf.convert_to_tensor(image_np)
                
        input_tensor=input_tensor[tf.newaxis, ...]
            
        detections=detect_fn(input_tensor)
        
        num_detections = int(detections.pop('num_detections'))
        detections = {key: value[0, :num_detections].numpy()
                    for key, value in detections.items()}
        detections['num_detections'] = num_detections

        # detection_classes should be ints.
        detections['detection_classes'] = detections['detection_classes'].astype(np.int64)    

        image_np_with_detections = image_np.copy()  

        max_score = max(list(detections['detection_scores']))
        indexes = [k for k,v in enumerate(detections['detection_scores']) if (v == max_score)]
        
        num_entities = len(indexes)

        class_id = itemgetter(*indexes)(detections['detection_classes'])
        
        max_score = round(max_score * 100,2)

        if (max_score > 90):
            class_name = str(category_index[class_id]['name']) 
        else:
            class_name = " "
    except:
        print ("Error Encountered")
        class_name = " "

    print ('{} : {}%'.format(class_name, class_id, max_score))
    
    data = {
        "caption" : class_name
    }

    return JsonResponse(data)