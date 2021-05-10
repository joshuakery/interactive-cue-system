import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

const theme = createMuiTheme({
  overrides: {
    MuiTableCell: {
        root: {
            padding: '2px',
        },
    },
    MuiToolbar: {
      root: {
        justifyContent: 'space-between',
      },
      regular: {
        minHeight: 0,
        '@media (min-width: 0px)': {
          minHeight: 0
        },
      },
    },
  },
  props: {
    MuiTextField: {
        size: "small",
    },
    MuiTableCell: {
        size: "small",
    }
  },
});

export default theme;