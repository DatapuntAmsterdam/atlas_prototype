| URL parameter       | State variable                  | hasDefaultValue        |
|---------------------|---------------------------------|------------------------|
| zoek                | search.query || search.location | no, null               |
| lat                 | map.viewCenter[0]               | yes, see DEFAULT_STATE |
| lon                 | map.viewCenter[1]               | yes, see DEFAULT_STATE |
| basiskaart          | map.baseLayer                   | yes, see DEFAULT_STATE |
| lagen               | map.overlays                    | no, []                 |
| zoom                | map.zoom                        | yes, see DEFAULT_STATE |
| actieve-kaartlagen  | map.showActiveOverlays          | false                  |
| volledig-scherm     | map.isFullScreen                | false                  |
|                     | map.isLoading                   | no                     |
| kaartlagen-selectie | layerSelection                  | false                  |
| pagina              | page                            | yes, see DEFAULT_STATE |
| detail              | detail.uri                      | no, detail is null     |
|                     | detail.isLoading                | no, detail is null     |
| id                  | straatbeeld.id                  | no                     |
|                     | straatbeeld.date                | no                     |
|                     | straatbeeld.location            | no                     |
| heading             | straatbeeld.heading             | no                     |
| pitch               | straatbeeld.pitch               | no                     |
| fov                 | straatbeeld.fov                 | no                     |
|                     | straatbeeld.hotspots            | no, []                 |
|                     | straatbeeld.isLoading           | no                     |
|                     | straatbeeld.image               | no                     |
|                     | straatbeeld.isInitial           | no                     |
