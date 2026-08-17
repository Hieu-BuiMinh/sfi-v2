/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState, useCallback } from 'react'
import { Button, Dialog, DialogContent, DialogActions } from '@mui/material'
import CameraAltIcon from '@mui/icons-material/CameraAlt'

interface CameraCaptureData {
	file: File
	previewUrl: string
	base64: string
}

interface CameraCaptureProps {
	onCapture?: (data: CameraCaptureData) => void
	onError?: (error: string) => void
	buttonText?: string
	buttonVariant?: 'text' | 'outlined' | 'contained'
	buttonClassName?: string
	maxWidth?: number
	maxHeight?: number
}

export const CameraCapture = ({
	onCapture,
	onError,
	buttonText = 'Camera',
	buttonVariant = 'outlined',
	buttonClassName,
	maxWidth = 1920,
	maxHeight = 1080,
}: CameraCaptureProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const [stream, setStream] = useState<MediaStream | null>(null)
	const [capturedImage, setCapturedImage] = useState<string | null>(null)
	const videoRef = useRef<HTMLVideoElement>(null)
	const canvasRef = useRef<HTMLCanvasElement>(null)

	const startCamera = useCallback(async () => {
		try {
			const mediaStream = await navigator.mediaDevices.getUserMedia({
				video: {
					width: { ideal: maxWidth },
					height: { ideal: maxHeight },
					facingMode: 'user',
				},
			})
			setStream(mediaStream)
			if (videoRef.current) {
				videoRef.current.srcObject = mediaStream
			}
		} catch (err) {
			onError?.('Failed to access camera. Please check permissions.')
			setIsOpen(false)
		}
	}, [maxWidth, maxHeight, onError])

	const stopCamera = useCallback(() => {
		if (stream) {
			stream.getTracks().forEach((track) => track.stop())
			setStream(null)
		}
	}, [stream])

	const handleOpen = (e?: React.MouseEvent) => {
		e?.stopPropagation()
		setIsOpen(true)
		setCapturedImage(null)
		startCamera()
	}

	const handleClose = (e?: React.MouseEvent) => {
		e?.stopPropagation()
		stopCamera()
		setIsOpen(false)
		setCapturedImage(null)
	}

	const handleCapture = (e?: React.MouseEvent) => {
		e?.stopPropagation()
		if (!videoRef.current || !canvasRef.current) return

		const video = videoRef.current
		const canvas = canvasRef.current
		const context = canvas.getContext('2d')

		if (!context) return

		// Set canvas size to video size
		canvas.width = video.videoWidth
		canvas.height = video.videoHeight

		// Draw video frame to canvas
		context.drawImage(video, 0, 0, canvas.width, canvas.height)

		// Get image as data URL
		const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9)
		setCapturedImage(imageDataUrl)
		stopCamera()
	}

	const handleRetake = (e?: React.MouseEvent) => {
		e?.stopPropagation()
		setCapturedImage(null)
		startCamera()
	}

	const handleConfirm = (e?: React.MouseEvent) => {
		e?.stopPropagation()
		if (!capturedImage) return
		stopCamera()

		// Convert data URL to Blob
		fetch(capturedImage)
			.then((res) => res.blob())
			.then((blob) => {
				// Create File from Blob
				const file = new File([blob], `camera-capture-${Date.now()}.jpg`, {
					type: 'image/jpeg',
				})

				// Create object URL for preview
				const previewUrl = URL.createObjectURL(file)

				// Call callback with data
				onCapture?.({
					file,
					previewUrl,
					base64: capturedImage,
				})

				handleClose()
			})
			.catch((err) => {
				onError?.('Failed to process captured image')
			})
	}

	// Cleanup on unmount
	React.useEffect(() => {
		return () => {
			stopCamera()
		}
	}, [stopCamera])

	return (
		<>
			<Button
				variant={buttonVariant}
				onClick={handleOpen}
				startIcon={<CameraAltIcon />}
				className={buttonClassName}
			>
				{buttonText}
			</Button>

			<Dialog
				open={isOpen}
				onClick={(event) => event.stopPropagation()}
				onClose={(event, reason) => {
					;(event as MouseEvent).stopPropagation()
					if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
						handleClose()
					}
				}}
				maxWidth="md"
				fullWidth
				slotProps={{
					paper: {
						className: 'bg-mui-bg-paper',
					},
				}}
			>
				<DialogContent className="p-0">
					<div className="relative flex aspect-video items-center justify-center bg-black">
						{capturedImage ? (
							<img src={capturedImage} alt="Captured" className="h-full w-full object-contain" />
						) : (
							<video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-contain" />
						)}
						<canvas ref={canvasRef} className="hidden" />
					</div>
				</DialogContent>

				<DialogActions className="gap-2 p-4">
					<Button onClick={handleClose} variant="outlined">
						Cancel
					</Button>

					{capturedImage ? (
						<>
							<Button onClick={handleRetake} variant="outlined">
								Retake
							</Button>
							<Button onClick={handleConfirm} variant="contained">
								Confirm
							</Button>
						</>
					) : (
						<Button onClick={handleCapture} variant="contained" disabled={!stream}>
							Capture
						</Button>
					)}
				</DialogActions>
			</Dialog>
		</>
	)
}
