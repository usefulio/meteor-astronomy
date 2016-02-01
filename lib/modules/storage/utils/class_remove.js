Astro.utils.storage.classRemove = function(className, selector, untrusted) {
  let Class = Astro.Class.get(className);
  let Collection = Class.getCollection();

  // Get all documents matching selector.
  let docs = Class.find(selector);

  // Prepare result of the method execution.
  let result = 0;

  docs.forEach(function(doc) {
    // Trigger the "beforeRemove" event handlers.
    if (!doc.dispatchEvent(new Astro.Event('beforeRemove', {
      cancelable: true, propagates: true, trusted: !untrusted
    }))) {
      // If an event was prevented, then we stop here.
      throw new Meteor.Error('prevented', 'Operation prevented', {
        eventName: 'beforeRemove'
      });
    }

    // Remove a document.
    result += Collection._collection.remove({_id: doc._id});

    // Set document as a new, so it will be possible to save a document again.
    doc._isNew = true;

    // Trigger the "afterRemove" event handlers.
    doc.dispatchEvent(new Astro.Event('afterRemove', {
      propagates: true, trusted: !untrusted
    }));
  });

  return result;
};