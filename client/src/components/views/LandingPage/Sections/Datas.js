const categorys = [
    {
        "_id": 1,
        "name": "원두"
    },
    {
        "_id": 2,
        "name": "커피용품"
    },
    {
        "_id": 3,
        "name": "커피머신"
    },
    {
        "_id": 4,
        "name": "디저트"
    }

]
const price = [
    {
        "_id": 0,
        "name": "Any",
        "array": []
    },
    {
        "_id": 1,
        "name": "$0 to $199",
        "array": [0, 199]
    },
    {
        "_id": 2,
        "name": "$200 to $249",
        "array": [200, 249]
    },
    {
        "_id": 3,
        "name": "$250 to $279",
        "array": [250, 279]
    },
    {
        "_id": 4,
        "name": "$280 to $299",
        "array": [280, 299]
    },
    {
        "_id": 5,
        "name": "More than $300",
        "array": [300, 15000000]
    },
]

export {
    categorys,
    price
}