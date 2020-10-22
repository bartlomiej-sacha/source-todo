import {
  Box,
  Button,
  createMuiTheme,
  MenuItem,
  ThemeProvider,
} from '@material-ui/core';
import {Field, Form, Formik} from 'formik';
import {Select, TextField} from 'formik-material-ui';
import React from 'react';
import {object, string} from 'yup';
import {sleep} from '../utils/utils';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#f69a2f',
      contrastText: '#fff',
      dark: '#494430',
    },
  },
});

function RowForm({setData}) {
  const handleSubmit = async (values, {resetForm}) => {
    await sleep(300);
    //check
    setData(prevState => [...prevState, {...values, id: prevState.length + 1}]);
    resetForm();
  };

  return (
    <div className="form-wrapper">
      <ThemeProvider theme={theme}>
        <Formik
          validationSchema={object({
            task_name: string().required('Task name is required!'),
            priority: string().oneOf(['Low', 'Medium', 'High']).required(),
          })}
          initialValues={{
            id: undefined,
            task_name: '',
            priority: 'Low',
            isDone: false,
          }}
          onSubmit={handleSubmit}
        >
          {({isSubmitting}) => (
            <Form className="form" autoComplete="off">
              <Field
                fullWidth
                name="task_name"
                label="Task name"
                component={TextField}
              />
              <Box width={95} margin={'0 10px'}>
                <Field
                  fullWidth
                  name="priority"
                  label="Priority"
                  component={Select}
                >
                  <MenuItem value={'Low'}>Low</MenuItem>
                  <MenuItem value={'Medium'}>Medium</MenuItem>
                  <MenuItem value={'High'}>High</MenuItem>
                </Field>
              </Box>
              <Box minWidth={100}>
                <Button
                  fullWidth
                  disabled={isSubmitting}
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  {isSubmitting ? 'Submitting' : 'Submit'}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </ThemeProvider>
    </div>
  );
}

export default RowForm;
