import { red } from '@material-ui/core/colors';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import FuseUtils from '@fuse/utils';
import { Controller, useFormContext } from 'react-hook-form';

const useStyles = makeStyles(theme => ({
	imageFeaturedStar: {
		position: 'absolute',
		top: 0,
		right: 10,
		color: red[400],
		opacity: 0,
		bottom: 0,
		margin: 'auto'
	},
	imageFeaturedIcon: {
		position: 'absolute',
		top: 0,
		left: 30,
		color: red[400]
	},
	imageUpload: {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut
	},
	imageItem: {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut,
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

function FileUploader(props) {
	const classes = useStyles(props);
	const methods = useFormContext();
	const { control, watch, setValue } = methods;
	const fileTypes = ['stl', 'dae', 'fbx', '3ds', 'collada', 'iges', 'x3d', 'vrml'];

	let attachments = watch('attachments', []);

	const deleteAttachment = index => {
		attachments = attachments.splice(index, 1);
	};

	return (
		<div>
			<div className="flex justify-center sm:justify-start flex-wrap flex-col -mx-16">
				<Controller
					name="attachments"
					control={control}
					defaultValue={[]}
					render={({ field: { onChange, value } }) => (
						<label
							htmlFor="button-file"
							className={clsx(
								classes.imageUpload,
								'flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer shadow hover:shadow-lg'
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
					name="featuredFileId"
					control={control}
					defaultValue=""
					render={({ field: { onChange, value } }) =>
						attachments
							? attachments?.map((media, index) => (
									<div
										className={clsx(
											classes.imageItem,
											'flex items-center justify-center relative h-60 rounded-16 mx-12 mb-24 overflow-hidden outline-none shadow hover:shadow-lg'
										)}
										key={index}
									>
										<img
											className={'w-60 h-60 ' + classes.imageFeaturedIcon}
											src={
												fileTypes.includes(media.type)
													? `assets/images/icons/3d.png`
													: `assets/images/icons/${media.type}.png`
											}
											alt=""
										/>
										<a href={media.url}>
											{media.name}.{media.type}
										</a>
										<Icon
											onClick={() => {
												deleteAttachment(index);
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

export default FileUploader;
