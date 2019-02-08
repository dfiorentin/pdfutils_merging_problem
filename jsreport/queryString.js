module.exports = function (reporter, definition) {
  reporter.beforeRenderListeners.add('queryString', function (req) {
    req.data = req.data || {}
    req.data.$query = req.query
  })
}
