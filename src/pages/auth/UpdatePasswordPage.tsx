import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert, Stack, Paper, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase/client';
import { translateAuthError } from '../../utils/authErrors';

const UpdatePasswordPage: React.FC = () => {
	const theme = useTheme();
	const navigate = useNavigate();
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [message, setMessage] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setMessage(null);

		if (password !== passwordConfirm) {
			setError('パスワードが一致しません。');
			return;
		}

		if (password.length < 6) {
			setError('パスワードは6文字以上で入力してください。');
			return;
		}

		setIsLoading(true);
		try {
			const { error: apiError } = await supabase.auth.updateUser({
				password: password,
			});

			if (apiError) {
				setError(translateAuthError(apiError.message));
			} else {
				setMessage('パスワードを更新しました。3秒後にダッシュボードへ移動します。');
				setTimeout(() => {
					navigate('/dashboard');
				}, 3000);
			}
		} catch (err) {
			setError('予期しないエラーが発生しました。');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight: '100vh',
				p: 2,
			}}
		>
			<Paper
				elevation={3}
				sx={{
					maxWidth: 400,
					width: '100%',
					p: 4,
					borderRadius: theme.shape.borderRadius,
				}}
			>
				<Typography variant="h5" component="h1" gutterBottom align="center" sx={{ fontWeight: 700 }}>
					新しいパスワードの設定
				</Typography>
				<Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
					新しいパスワードを入力して、アカウントの復旧を完了させてください。
				</Typography>

				{error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
				{message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

				{!message && (
					<Box component="form" onSubmit={handleSubmit}>
						<Stack spacing={3}>
							<TextField
								label="新しいパスワード"
								type="password"
								fullWidth
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<TextField
								label="新しいパスワード（確認用）"
								type="password"
								fullWidth
								required
								value={passwordConfirm}
								onChange={(e) => setPasswordConfirm(e.target.value)}
							/>
							<Button
								type="submit"
								variant="contained"
								size="large"
								fullWidth
								disabled={isLoading}
							>
								{isLoading ? '更新中...' : 'パスワードを更新する'}
							</Button>
						</Stack>
					</Box>
				)}
			</Paper>
		</Box>
	);
};

export default UpdatePasswordPage;