const { Audit } = require("./models");

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

async function audit(req, action, entityType, entityId, metadata = {}) {
  await Audit.create({
    actor: req.user?._id,
    action,
    entityType,
    entityId,
    metadata,
    ip: req.ip,
  });
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

module.exports = { asyncHandler, audit, publicUser };

