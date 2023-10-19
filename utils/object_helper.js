exports.isObjectEmpty = (objectName) => {
    return Object.keys(objectName).length === 0;
  };
  
  exports.cleanObject = (obj, hasCreatedAt = false) => {
    if (obj._id) {
      obj.id = obj._id;
    }
    delete obj._id;
    delete obj.__v;
    delete obj.updated_at;
    delete obj.password;
    if (!hasCreatedAt) {
      delete obj.created_at;
    }
    return obj;
  };
  