/**
* @class
* @example
* var api = new UserRecordingsApi(pureCloudSession);
*/
var UserRecordingsApi = function (pureCloudSession) {
	/**
     * @summary Get a list of user recordings.
	 * @memberOf UserRecordingsApi#
	* @param {integer} pageSize - Page size
	* @param {integer} pageNumber - Page number
	* @param {string} expand - conversation
	*/
	function get(pageSize, pageNumber, expand){
		var apipath = '/api/v1/userrecordings';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}


		return pureCloudSession.makeRequest('GET', apipath + '?' +$.param(queryParameters), requestBody);
	}
	self.get = get;
	/**
     * @summary Get user recording summary
	 * @memberOf UserRecordingsApi#
	*/
	function getSummary(){
		var apipath = '/api/v1/userrecordings/summary';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		return pureCloudSession.makeRequest('GET', apipath + '?' +$.param(queryParameters), requestBody);
	}
	self.getSummary = getSummary;
	/**
     * @summary Get a user recording.
	 * @memberOf UserRecordingsApi#
	* @param {string} recordingId - User Recording ID
	* @param {string} expand - conversation
	*/
	function getRecording(recordingId, expand){
		var apipath = '/api/v1/userrecordings/{recordingId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        apipath = apipath.replace('{recordingId}', recordingId);

        if(recordingId === undefined && recordingId !== null){
			throw 'Missing required  parameter: recordingId';
        }


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}


		return pureCloudSession.makeRequest('GET', apipath + '?' +$.param(queryParameters), requestBody);
	}
	self.getRecording = getRecording;
	/**
     * @summary Update a user recording.
	 * @memberOf UserRecordingsApi#
	* @param {string} recordingId - User Recording ID
	* @param {} body - UserRecording
	* @param {string} expand - conversation
	 * @example
	 * Body Example:
	 * {
   "name": "",
   "dateCreated": "",
   "dateModified": "",
   "contentUri": "",
   "workspace": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "createdBy": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "conversation": {
      "name": "",
      "startTime": "",
      "endTime": "",
      "participants": [],
      "conversationIds": [],
      "maxParticipants": 0,
      "recordingState": ""
   },
   "contentLength": 0,
   "durationMilliseconds": 0,
   "thumbnails": [],
   "read": true
}
	*/
	function updateRecording(recordingId, body, expand){
		var apipath = '/api/v1/userrecordings/{recordingId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        apipath = apipath.replace('{recordingId}', recordingId);

        if(recordingId === undefined && recordingId !== null){
			throw 'Missing required  parameter: recordingId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}


		return pureCloudSession.makeRequest('PUT', apipath + '?' +$.param(queryParameters), requestBody);
	}
	self.updateRecording = updateRecording;
	/**
     * @summary Delete a user recording.
	 * @memberOf UserRecordingsApi#
	* @param {string} recordingId - User Recording ID
	*/
	function deleteRecording(recordingId){
		var apipath = '/api/v1/userrecordings/{recordingId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        apipath = apipath.replace('{recordingId}', recordingId);

        if(recordingId === undefined && recordingId !== null){
			throw 'Missing required  parameter: recordingId';
        }


		return pureCloudSession.makeRequest('DELETE', apipath + '?' +$.param(queryParameters), requestBody);
	}
	self.deleteRecording = deleteRecording;
	/**
     * @summary Download a user recording.
	 * @memberOf UserRecordingsApi#
	* @param {string} recordingId - User Recording ID
	* @param {string} formatId - The desired format (WEBM, WAV, etc.)
	WEBM,
	WAV,
	*/
	function getRecordingMedia(recordingId, formatId){
		var apipath = '/api/v1/userrecordings/{recordingId}/media';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        apipath = apipath.replace('{recordingId}', recordingId);

        if(recordingId === undefined && recordingId !== null){
			throw 'Missing required  parameter: recordingId';
        }


		if(formatId !== undefined && formatId !== null){
			queryParameters.formatId = formatId;
		}


		return pureCloudSession.makeRequest('GET', apipath + '?' +$.param(queryParameters), requestBody);
	}
	self.getRecordingMedia = getRecordingMedia;

    return self;
};
