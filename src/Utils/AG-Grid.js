import Skeleton from 'react-loading-skeleton'

export const defineColumns = ({columnKeys, columnHeaders, extraColumns, skeletonCount}) => {
        var loadedColumnDefs = []
        var skeletonColumnDefs = []
        var skeletonRows = []

        columnKeys.forEach((key, index )=> {
            loadedColumnDefs.push({field: key, headerName: columnHeaders[index], cellStyle: { 'textAlign': 'center' }, sortable: true})
        })

        if (extraColumns !== undefined) {
            extraColumns.forEach((extraColumn) => {
                loadedColumnDefs.push(extraColumn)
            })
        }

        columnKeys.forEach((key, index )=> {
            skeletonColumnDefs.push({field: key, headerName: columnHeaders[index], cellStyle: { 'textAlign': 'center' }, sortable: true, cellRenderer: Skeleton})
        })

        if (skeletonCount === undefined) {
            var row = {}
            columnKeys.forEach((key)=> {
                row[key] = Skeleton
            })

            for (var i = 0; i < 10; i++) {
                skeletonRows.push(row)
            }
        } else {
            var row = {}
            columnKeys.forEach((key)=> {
                row[key] = Skeleton
            })

            for (var i = 0; i < skeletonCount; i++) {
                skeletonRows.push(row)
            }
        }

        return {
            loadedColumnDefs,
            skeletonColumnDefs,
            skeletonRows
        }
}

