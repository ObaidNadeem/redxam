import PrettyError from 'pretty-error';

const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express', 'graphql');

export default (req, raven, error) => {
  if (error.path || error.name !== 'GraphQLError') {
    console.error(pe.render(error));
    raven.captureException(error,
      raven.parsers.parseRequest(req, {
        tags: { graphql: 'exec_error' },
        extra: {
          source: error.source && error.source.body,
          positions: error.positions,
          path: error.path,
        },
      }),
    );
  } else {
    console.error(pe.render(error.message));
    raven.captureMessage(`GraphQLWrongQuery: ${error.message}`,
      raven.parsers.parseRequest(req, {
        tags: { graphql: 'wrong_query' },
        extra: {
          source: error.source && error.source.body,
          positions: error.positions,
        },
      }),
    );
  }
  return {
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack.split('\n') : null,
  };
};
