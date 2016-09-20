| URL parameter       | State variable                  | hasDefaultValue        |
|---------------------|---------------------------------|------------------------|
| zoek                | search.query || search.location | no, null               |
| lat                 | map.viewCenter[0]               | yes, see DEFAULT_STATE |
| lon                 | map.viewCenter[1]               | yes, see DEFAULT_STATE |
| basiskaart          | map.baseLayer                   | yes, see DEFAULT_STATE |
| lagen               | map.overlays                    | no, []                 |
| zoom                | map.zoom                        | yes, see DEFAULT_STATE |
| selectie            | map.highlight                   | no, null               |
| actieve-kaartlagen  | map.showActiveOverlays          | false                  |
|                     | map.isLoading                   | no                     |
| pagina              | page                            | yes, see DEFAULT_STATE |
| detail              | detail.uri                      | no, detail is null     |
|                     | detail.isLoading                | no, detail is null     |
| id                  | straatbeeld.id                  | no                     |
| plat                | straatbeeld.searchLocation[0]   | no                     |
| plon                | straatbeeld.searchLocation[1]   | no                     |
|                     | straatbeeld.date                | no                     |
|                     | straatbeeld.camera.location     | no                     |
| heading             | straatbeeld.camera.heading      | no                     |
| pitch               | straatbeeld.camera.pitch        | no                     |
| fov                 | straatbeeld.camera.fov          | no                     |
|                     | straatbeeld.hotspots            | no, []                 |
|                     | straatbeeld.isLoading           | no                     |
| vensters            | stackedPanels                   | []                     |
| print-versie        | isPrintMode                     | false                  |