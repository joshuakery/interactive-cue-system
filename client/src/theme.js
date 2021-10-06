import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
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