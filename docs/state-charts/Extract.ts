
  // Available variables:
  // - Machine
  // - interpret
  // - assign
  // - send
  // - sendParent
  // - spawn
  // - raise
  // - actions
  // - XState (all XState exports)

  const fetchMachine = Machine({
    id: 'Extract',
    initial: 'NEW',
    context: {
      retries: 0
    },
    states: {
      NEW: {
        on: {
          Ingress: 'STARTED'
        }
      },
      STARTED: {
        on: {
          Scan: 'SCANNED',
          Error: 'ERROR'
        }
      },
      SCANNED: {
        on: {
          Structure: 'FINISHED',
          Error: 'ERROR'
        }
      },
      FINISHED: {
        type: 'final'
      },
      ERROR: {
        type: 'final',
      }
    }
  });
