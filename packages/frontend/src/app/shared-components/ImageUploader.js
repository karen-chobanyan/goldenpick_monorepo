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
		right: 0,
		color: red[400],
		opacity: 0
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

function ImageUploader(props) {
	const classes = useStyles(props);
	const methods = useFormContext();
	const { control, watch, setValue } = methods;

	let images = watch('images', []);

	const deleteImages = index => {
		images = images.splice(index, 1);
	};

	return (
		<div>
			<div className="flex justify-center sm:justify-start flex-wrap -mx-16">
				<Controller
					name="images"
					control={control}
					defaultValue={[]}
					render={({ field: { onChange, value } }) => (
						<label
							htmlFor="button-image"
							className={clsx(
								classes.imageUpload,
								'flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer shadow hover:shadow-lg'
							)}
						>
							<input
								accept="image/*"
								className="hidden"
								id="button-image"
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
													type: 'image'
												});
											};

											reader.onerror = reject;

											reader.readAsBinaryString(file);
										});
									}

									const newImage = await readFileAsync();

									onChange([newImage, ...value]);
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
						images.map((media, index) => (
							<div
								className={clsx(
									classes.imageItem,
									'flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden outline-none shadow hover:shadow-lg'
								)}
								key={index}
							>
								<Icon
									onClick={() => {
										images = images.splice(index, 1);
										onChange();
									}}
									role="button"
									className={classes.imageFeaturedStar}
								>
									delete
								</Icon>
								<img className="max-w-none w-auto h-full" src={media.url} alt="product" />
							</div>
						))
					}
				/>
			</div>
		</div>
	);
}

export default ImageUploader;
