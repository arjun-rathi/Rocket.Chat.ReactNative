import React, { ForwardedRef, forwardRef, useContext, useRef } from 'react';

import ActionSheet from './ActionSheet';

export type TActionSheetOptionsItem = { title: string; icon: string; onPress: () => void };

export type TActionSheetOptions = {
	options: TActionSheetOptionsItem[];
	headerHeight: number;
	customHeader: React.ReactElement | null;
	hasCancel?: boolean;
};
interface IActionSheetProvider {
	showActionSheet: (item: TActionSheetOptions) => void;
	hideActionSheet: () => void;
}

const context = React.createContext<IActionSheetProvider>({
	showActionSheet: () => {},
	hideActionSheet: () => {}
});

export const useActionSheet = () => useContext(context);

const { Provider, Consumer } = context;

export const withActionSheet = (Component: React.ComponentType<any>): typeof Component =>
	forwardRef((props: typeof React.Component, ref: ForwardedRef<IActionSheetProvider>) => (
		<Consumer>{(contexts: IActionSheetProvider) => <Component {...props} {...contexts} ref={ref} />}</Consumer>
	));

export const ActionSheetProvider = React.memo(({ children }: { children: React.ReactElement | React.ReactElement[] }) => {
	const ref: ForwardedRef<IActionSheetProvider> = useRef(null);

	const getContext = () => ({
		showActionSheet: (options: TActionSheetOptions) => {
			ref.current?.showActionSheet(options);
		},
		hideActionSheet: () => {
			ref.current?.hideActionSheet();
		}
	});

	return (
		<Provider value={getContext()}>
			<ActionSheet ref={ref}>
				<>{children}</>
			</ActionSheet>
		</Provider>
	);
});
