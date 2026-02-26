import { Alert, Stack, Typography } from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";

interface ErrorAlertProps {
    error: string | null;
};

const ErrorAlert = (props: ErrorAlertProps) => {
    const { error } = props;
    return (
        error &&
        <Alert
            severity="error"
            icon={<ErrorOutline sx={{ fontSize: 20, color: 'error.main', mt: 0.5 }} />}
            sx={{ mb: 4, borderRadius: '0.75rem', animation: 'slideUp 0.3s ease-out' }}
        >
            <Stack spacing={0.5}>
                <Typography variant="subtitle2" sx={{ fontWeight: 500, color: 'error.main' }}>
                    操作失败
                </Typography>
                <Typography variant="body2" sx={{ color: 'error.main', opacity: 0.8 }}>
                    {error}
                </Typography>
            </Stack>
        </Alert>
    );
};

export default ErrorAlert;