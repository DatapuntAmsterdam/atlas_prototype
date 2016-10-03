| URL parameter       | State variable                  | hasDefaultValue        |
|---------------------|---------------------------------|------------------------|
| zoek                | search.query || search.location | no, null               |
| lat                 | map.viewCenter[0]               | yes, see DEFAULT_STATE |
| lon                 | map.viewCenter[1]               | yes, see DEFAULT_STATE |
| basiskaart          | map.baseLayer                   | yes, see DEFAULT_STATE |
| lagen               | map.overlays                    | no, []                 |
| zoom                | map.zoom                        | yes, see DEFAULT_STATE |
| selectie            | map.highlight                   | no, null               |
| kaartlagen-selectie | map.showLayerSelection          | false                  |
| actieve-kaartlagen  | map.showActiveOverlays          | false                  |
| volledig-scherm     | map.isFullScreen                | false                  |
|                     | map.isLoading                   | no                     |
| pagina              | page                            | yes, see DEFAULT_STATE |
| detail              | detail.uri                      | no, detail is null     |
|                     | detail.isLoading                | no, detail is null     |
| id                  | panorama.id                  | no                     |
|                     | panorama.date                | no                     |
|                     | panorama.location            | no                     |
| heading             | panorama.heading             | no                     |
| pitch               | panorama.pitch               | no                     |
| fov                 | panorama.fov                 | no                     |
|                     | panorama.hotspots            | no, []                 |
|                     | panorama.isLoading           | no                     |
|                     | panorama.image               | no                     |
|                     | panorama.isInitial           | no                     |