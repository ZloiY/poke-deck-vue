import { watchEffect, ref, toValue } from "vue";

export const useFetch = <ResponseType>(url?: string) => {
	const isLoading = ref(true);
	const response = ref<ResponseType>();
	const error = ref();

	watchEffect(() => {
		isLoading.value = true;
		response.value = undefined;
		error.value = undefined;

		if (url) {
			fetch(toValue(url))
				.then(response => response.json())
				.then(json => (response.value = json as ResponseType))
				.catch(err => (error.value = err))
				.finally(() => (isLoading.value = false));
		}
	})

	return { response, isLoading, error };
}
