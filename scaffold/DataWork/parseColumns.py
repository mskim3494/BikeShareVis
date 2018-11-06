import pandas as pd 


biketrips  = pd.read_csv('bikeshare_data.csv')
stations = pd.read_csv('bikestations.csv')

trips_filtered = biketrips[['duration_sec', 'start_date', 'start_station_id', 'end_station_id']]

stations_filtered = stations[['station_id', 'latitude', 'longitude', 'name']]

print(trips_filtered.shape)

stations_filtered.to_csv('stationsFiltered.csv')
trips_filtered.to_csv('tripsFiltered.csv')

