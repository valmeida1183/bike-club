const apiUrl = 'https://bikeclubwebapi.azurewebsites.net';
const apiVersion = 'v1';

export const environment = {
  production: true,
  firebaseApiKey: 'AIzaSyAzPmvGAZOxtMFQFIPv2gdkG2HDqVAvcyU',
  apiUrl,
  apiVersion,
  baseApiUrl: `${apiUrl}/${apiVersion}`,
  imageResource: `${apiUrl}/resources/images/`
};
