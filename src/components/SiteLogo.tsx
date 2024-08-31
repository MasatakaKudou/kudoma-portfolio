import Same from './Same';

import { Stack, Typography } from '@mui/material'

const SiteLogo = () => {
  return (
    <div>
      <Stack direction='row' alignItems='center'>
        <Typography variant='h2' sx={{ marginRight: 1 }}>Kudoma</Typography>
        <Same />
      </Stack>
      <Stack direction='row' alignItems='center'>
        <Same />
        <Typography variant='h2' sx={{ marginLeft: 1 }}>Portfolio</Typography>
      </Stack>
    </div>
  );
};
  
export default SiteLogo;
