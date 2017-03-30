export default class ServerCaller {
  constructor(options) {
    this._storeOptions(options);
  }

  getVocabularies(onComplete) {
    this.getVocabulariesPromise()
      .done( (data, textStatus, jqXHR) => {
        onComplete();
      });
  }

  getVocabulariesPromise() {
    return $.ajax(this.urls.vocabulariesUrl, {
      dataType: "json"
    })
  }

  _storeOptions(options) {
    console.log("DEBUG: initializing typewar server caller");
    if(_.isEmpty(options)){ return; }
    this.urls = {
      vocabulariesUrl: options.vocabulariesUrl || null
    }
  }
}
