const routeAuthenticationGuard = (request, response, next) => {
  console.log(request);
  if (request.user) {
    next();
  } else {
    next(new Error('User is not authenticated'));
  }
};

module.exports = routeAuthenticationGuard;
