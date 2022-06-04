<div align="center">
 

![product-logo](./screenshots/Datagenie_logo.png) 

 
[![](https://img.shields.io/badge/IDE-Visual_Studio_Code-purple?style=for-the-badge&logo=visual-studio-code)](https://code.visualstudio.com/  "Visual Studio Code")
[![](https://img.shields.io/badge/Database-MongoDB-green?style=for-the-badge&logo=mongodb)](mongodb.com "MongoDB")
[![](https://img.shields.io/badge/Made_with-Python-blue?style=for-the-badge&logo=python)](https://www.python.org/)
[![](https://img.shields.io/badge/Made_with-Reactjs-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
</div>

## Need ##
Not everyone has knowledge of ML and their models to recognize certain types of patterns within a huge dataset. To an ordinary user, it would be very difficult training a model over a set of data, providing it with an algorithm that it can use to reason over and learn from that data and also perform operations like preprocessing, imputation, visualization etc. A system to input data and get appropriate diagnosis along with an auto selected model would come in handy especially to the modern industrial sectors. The platform allows users who don't have any background knowledge of ML or its models and operations to predict and analyze data
with ease.

## Description ##
A platform that eases the work of data and business analysts in generating inferences from data without having knowledge of the coding side of things. It will provide complete data handling capabilities from ETL(Extract, Transform and Load) pipelines needed to build the dataset, automated data profiling and cleaning, analyzing how the data changes over time, improving the data quality. As the next step, neural networks would be automatically generated to perform classification or regression tasks on any target variable from the dataset. The platform will also create and suggest beautiful visualizations for the given dataset that can help drive decisions and understand the data at hand better.

## Features ##
- Allow the user to input a dataset in the form of CSV format.
- Perform basic operations on the input dataset such as identification of columns, their data types, statistics like mean, min, max, grouping etc.
- Perform data imputation for missing data for a given dataset.
- Prepare the input dataset by applying various preprocessing techniques like handling outlier, one hot encoding, feature scaling etc
- Develop an algorithm for Automatic Model Selection, using a genetic approach that automatically and efficiently finds the most suitable neural network model for a given dataset.
- Develop an auto data visualization algorithm to show top k data visualization for a given dataset.
 
## Application Screenshots ##
<div align="center">
 
#### **Home Page**
 
![product-home](./screenshots/homepg_full.png)

#### **Signup**
![product-signup](./screenshots/signup.PNG)
 
#### **Login**

![product-signin](./screenshots/signin.PNG)
 
#### **Dataset Input**

![product-datasetinput](./screenshots/input_dataset.PNG)
 
#### **Displaying all the datasets created by the user**

![product-datasetlist](./screenshots/list_datasets.PNG)
 
#### **Data Imputation**
 
![product-datasetimp](./screenshots/imputation.PNG)

#### **Dataset Details**

![product-datasetinfo1](./screenshots/db_info.png)
##### Edit Dataset Details
![product-datasetdesp](./screenshots/edit_readme.png)
##### Dataset Catalog
![product-datasetinfo2](./screenshots/db_catalog.png)
 
#### **Data Visualisation**
 
![product-visualisation](./screenshots/visualisation.png)
 
#### **Model Selection**

![product-modelselection](./screenshots/model_select.PNG)

##### After the model selection task is completed:

![product-jobdetails](./screenshots/job_details.PNG)

</div>

## How To Use
#### Software Requirements
- VSCode
- MongoDB

## Installation

Clone the repo
```html
git clone https://github.com/deepanshu2506/auto-ml.git
```

Install the dependencies by running:
```html  
pip3 install -r requirements.txt
```
```html  
yarn install
```


#### Run using Command Prompt

```html
flask run
```

```html
cd ./frontend
yarn start
```

---
### Tech stack

`Frontend` : React  <br>
`Backend` : Flask(Python)  <br>
`Database` : MongoDB <br>

------------------------------------------

<h3 align="center"><b>Developed  by <a href="https://github.com/deepanshu2506">Deepanshu Vangani</a> , <a href="https://github.com/Parth18Shah">Parth Shah</a> , <a href="https://github.com/Sakshi107">Sakshi Shelar</a> and <a href="https://github.com/hiral72">Hiral Sheth</a></b></h3>

