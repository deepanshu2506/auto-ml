"""
This file is for testing.
Step 1. Read CSV file by ``from_csv'' function
Step 2. Select a visualization selection method.
Step 3. Select output method, e.g., to_single_html()
Step 4. Check results.
"""

from lib.deepeye_pack import deepeye

# from IPython.core.display import display, HTML

# create a deepeye_pack class that wraps everything
dp = deepeye("demo")  # the name here doesn't actually matter

# The followings are test datasets
# User can choose one to test

file = "./lib/visualization/datasets/FlightDelayStatistics2015.csv"
# file = './datasets/Foreign Visitor Arrivals By Purpose(Jan-Dec 2015).csv'
# file = './datasets/HollywoodsMostProfitableStories.csv'
# file = './datasets/MostPopularBaby_Names(NewYork).csv'
# file = './datasets/SummerOlympic_1896_2008.csv'
# file = './datasets/electricityConsumptionOfEasternChina.csv'
# file = './datasets/happinessRanking(2015-2016).csv'
# file = "./lib/visualization/datasets/titanicPassenger.csv"

file = "C:/Users/deepa/desktop/housing.csv"
# read the datasets
dp.from_csv(file)

# choose one from three ranking function

dp.learning_to_rank()
# dp.partial_order()
# dp.diversified_ranking()

# output functions
# can use several different methods at the same time

# dp.to_single_html()

# dp.to_single_json()
# dp.to_multiple_htmls()
for x in dp.to_list()[0:10]:
    print(type(x))


# dp.to_print_out()
# dp.to_multiple_jsons()

# dp.show_visualizations().render_notebook()
