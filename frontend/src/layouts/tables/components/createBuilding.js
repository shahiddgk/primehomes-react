import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { TextField } from '@mui/material';


const steps = ['Information', 'Location', 'Dues'];

export default function HorizontalNonLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const [modalValue, setModalValue] = React.useState({
    code: '',
    name: '',
    phase: '',
    address: '',
    city: '',
    dues: 0,
    dueDays: 0
  })


  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  return (
    <DashboardLayout>
        <DashboardNavbar />
        <Box sx={{ width: '100%' }}>
        <Stepper nonLinear activeStep={activeStep}>
            {steps.map((label, index) => (
            <Step key={label} completed={completed[index]}>
                <StepButton color="inherit" onClick={handleStep(index)}>
                {label}
                </StepButton>
            </Step>
            ))}
        </Stepper>
        <div>
            {allStepsCompleted() ? (
            <>
                <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button onClick={handleReset}>Reset</Button>
                </Box>
            </>
            ) : (
            <Box
                sx={{
                    maxWidth: '100%',
                    minHeight:'60vh',
                    display:'flex',
                    // alignItems:'center',
                    flexDirection:'column',
                    justifyContent:'space-between'
                }}
                >
                
                <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
                Step {activeStep + 1}
                </Typography>
                {/* Body */}
                {activeStep+1 === 1 && 
                <Box sx={{ display: 'flex', flexDirection: 'column', p: 4 }}>
                    <Box
                        sx={{
                            margin:'9px',
                            width: 300,
                            maxWidth: '50%'
                        }}
                        >
                        <h5>Building Information</h5>
                        <TextField value={modalValue.code} onChange={e => setModalValue({...modalValue, code: e.target.value})} variant='standard' fullWidth label="Building Code" />
                    </Box>
                    <Box
                        sx={{
                            margin:'9px',
                            width: 500,
                            maxWidth: '100%'
                        }}
                        >
                        <TextField variant='standard' fullWidth label="Building Name" />
                    </Box>
                </Box>
                }

                {activeStep+1 === 2 && 
                <Box sx={{ display: 'flex', flexDirection: 'column', p: 4 }}>
                    <Box
                        sx={{
                            margin:'9px',
                            width: 200,
                            maxWidth: '30%'
                        }}
                        >
                        <h5>Building Location</h5>
                        <TextField variant='standard' fullWidth label="Phase" />
                    </Box>
                    <Box
                        sx={{
                            margin:'9px',
                            width: 500,
                            maxWidth: '100%'
                        }}
                        >
                        <TextField variant='standard' fullWidth label="Address" />
                    </Box>
                    <Box
                        sx={{
                            margin:'9px',
                            width: 500,
                            maxWidth: '100%'
                        }}
                        >
                        <TextField variant='standard' fullWidth label="City" />
                    </Box>
                </Box>
                }

                {activeStep+1 === 3 && 
                <Box sx={{ display: 'flex', flexDirection: 'column', p: 4 }}>
                    <Box
                        sx={{
                            margin:'9px',
                            width: 200,
                            maxWidth: '30%'
                        }}
                        >
                        <h5>Dues</h5>
                        <TextField variant='standard' fullWidth label="Dues" />
                    </Box>
                    <Box
                        sx={{
                            margin:'9px',
                            width: 200,
                            maxWidth: '30%'
                        }}
                        >
                        <TextField variant='standard' fullWidth label="Due Days" />
                    </Box>
                </Box>
                }

                {/* Footer */}
                <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                    >
                        Back
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button onClick={handleNext} sx={{ mr: 1 }}>
                        Next
                    </Button>
                {activeStep !== steps.length &&
                    (completed[activeStep] ? (
                    <Typography variant="caption" sx={{ display: 'inline-block' }}>
                        Step {activeStep + 1} already completed
                    </Typography>
                    ) : (
                    <Button onClick={handleComplete}>
                        {completedSteps() === totalSteps() - 1
                        ? 'Finish'
                        : 'Complete Step'}
                    </Button>
                    ))}
                </Box>
            </Box>
            )}
        </div>
        </Box>
    </DashboardLayout>
  );
}