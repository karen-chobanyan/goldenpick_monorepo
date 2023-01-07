import { red } from '@material-ui/core/colors';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import FuseUtils from '@fuse/utils';
import { Controller, useFormContext } from 'react-hook-form';

const useStyles = makeStyles(theme => ({
	imageSet: {
		height: 'auto'
	},
	imageFeaturedStar: {
		position: 'absolute',
		top: 12,
		right: 10,
		color: red[400],
		opacity: 0
	},
	imageFeaturedIcon: {
		position: 'absolute'
	},
	imageUpload: {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut,
		height: '30rem',
		width: '100%'
	},
	imageItem: {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut,
		height: '30rem',
		width: '20%',
		position: 'absolute',
		'&:hover': {
			'& $imageFeaturedStar': {
				opacity: 0.8
			}
		},
		'&.featured': {
			pointerEvents: 'none',
			boxShadow: theme.shadows[3],
			'& $imageFeaturedStar': {
				opacity: 1
			},
			'&:hover $imageFeaturedStar': {
				opacity: 1
			}
		}
	}
}));

function ProadCastUplader(props) {
	const classes = useStyles(props);
	const methods = useFormContext();
	const { control, watch, setValue } = methods;

	const fileTypes = ['stl', 'dae', 'fbx', '3ds', 'collada', 'iges', 'x3d', 'vrml'];

	let attachments = watch('attachments', []);

	const deleteImages = index => {
		attachments = attachments.splice(index, 1);
	};

	return (
		<div>
			<div className="flex justify-center sm:justify-start relative flex-wrap -mx-16">
				<Controller
					name="attachments"
					control={control}
					defaultValue={[]}
					render={({ field: { onChange, value } }) => (
						<label
							htmlFor="button-file"
							className={clsx(
								classes.imageUpload,
								'flex items-center justify-center w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer shadow hover:shadow-lg'
							)}
						>
							<input
								className="hidden"
								id="button-file"
								type="file"
								multiple
								onChange={async e => {
									function readFileAsync() {
										return new Promise((resolve, reject) => {
											const file = e.target.files[0];
											if (!file) {
												return;
											}
											const reader = new FileReader();

											reader.onload = () => {
												resolve({
													id: FuseUtils.generateGUID(),
													url: `data:${file.type};base64,${btoa(reader.result)}`,
													name: file.name.split('.')[0],
													type: file.type.split('/')[1]
												});
											};

											reader.onerror = reject;

											reader.readAsBinaryString(file);
										});
									}

									const newFile = await readFileAsync();

									onChange([newFile, ...value]);
								}}
							/>
							<Icon fontSize="large" color="action">
								cloud_upload
							</Icon>
						</label>
					)}
				/>
				<Controller
					name="featuredImageId"
					control={control}
					defaultValue=""
					render={({ field: { onChange, value } }) =>
						attachments
							? attachments?.map((media, index) => (
									<div
										className={clsx(
											classes.imageItem,
											'flex items-center justify-center relative h-128 w-128 rounded-16 mx-12 mb-24 overflow-hidden outline-none shadow hover:shadow-lg'
										)}
										key={index}
									>
										{media.type === 'mp4' ? (
											<video autoPlay loop muted>
												<source src={media.url} type="video/mp4" />
											</video>
										) : (
											<img
												className={'h-128 w-128' + classes.imageFeaturedIcon}
												src={media.url}
												alt="contact-img"
											/>
										)}

										<Icon
											onClick={() => {
												deleteImages(index);
												onChange();
											}}
											role="button"
											className={classes.imageFeaturedStar}
										>
											delete
										</Icon>
									</div>
							  ))
							: null
					}
				/>
			</div>
		</div>
	);
}

export default ProadCastUplader;
