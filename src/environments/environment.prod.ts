const apiUrl = 'https://bikeclubwebapi.azurewebsites.net';
const apiVersion = 'v1';

export const environment = {
	production: true,
	firebaseApiKey: 'AIzaSyAzPmvGAZOxtMFQFIPv2gdkG2HDqVAvcyU',
	apiUrl,
	apiVersion,
	baseApiUrl: `${apiUrl}/${apiVersion}`,
	imageResource: `${apiUrl}/resources/images/`,
	stripePublishableKey:
		'pk_test_51U9ESuHORatcURcAzG8PRxB0owGiqXpOrbewnmAJKJk6XHpXBuK37XfhZZliBcIQNReOpD48Yd5kqkPkcuahZClj00taak6CUo',
};
