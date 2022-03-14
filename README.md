# Maison

Maison is a housemate sharing app to split bills, add recurring bills, and simplify the splitting process from competitors. 

## Demo
![alt text](https://github.com/danielcagostinho/Maison/blob/master/demo/maison-demo-1.webp "Logo Title Text 1")
![alt text](https://github.com/danielcagostinho/Maison/blob/master/demo/maison-demo-2.webp "Logo Title Text 1")
![alt text](https://github.com/danielcagostinho/Maison/blob/master/demo/maison-demo-3.webp "Logo Title Text 1")


## Maison in Action
![alt text](https://github.com/danielcagostinho/Maison/blob/master/demo/NewBill.gif "New Bill")
![alt text](https://github.com/danielcagostinho/Maison/blob/master/demo/SettleUp.gif "Settling up")
## Installation and Running-

To locally run this app, you must have Expo, Node.js, and Ngrok installed on your machine and Expo App on your mobile device.
```
cd app-maison && npm i
cd maison-server && npm i
```

To run:
Start the backend
```
cd maison-server && npm run dev
```
Setup ngrok tunnel pointing to port 3000 (or whichever route the backend uses);
Copy ngrok url to baseurl in `./app-maison/src/api/maison.js`

Start expo `expo start`.

Scan the QR code in the terminal output window.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
