const { join } = require('path');
module.exports = function requireOrFallback(...tryPaths) {
  for (const path of tryPaths)
    try { return require(join(process.cwd(),path)); } catch { }
  return {};
}
