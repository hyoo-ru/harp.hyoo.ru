# $hyoo_harp_scheme

HARP Scheme with parser/serializer and static/dynamic validation/normalization

## Usage

### Define scheme

Use [$mol_data](https://github.com/hyoo-ru/mam_mol/tree/master/data) to where it's relevant.

```ts
const Str = $mol_data_optional( $hyoo_harp_scheme( {}, String ) )
const Int = $mol_data_optional( $hyoo_harp_scheme( {}, Number ) )

const Article = $hyoo_harp_scheme({
    title: Str,
    content: Int,
})

const Person = $hyoo_harp_scheme({
    name: Str,
    age: Int,
    article: $mol_data_optional( Article ),
})
```

### Build Query

```ts
// person(name;+age=18@=;article(title);_num=20@29=)
const query = Person.build({
    person: {
        name: {},
        age: {
            '+': true,
            '=': [
                [ 18, '' ]
            ],
        },
        article: {
            title: {},
        },
        '_num': {
            '=': [
                [ 20, 29 ]
            ],
        },
    },
})
```

### Parse Query

```ts
const query = Person.parse( 'person(+age=18@=;+name;article(title);_num=20@29=)' )

const article_fetch1 = Object.keys( query.person.article ) // ❌ article may be absent
const article_fetch2 = Object.keys( query.person.article ?? {} ) // ✅
const follower_fetch = Object.keys( query.follower ?? {} ) // ❌ Person don't have follower
```

### Validate Query JSON

```ts
const person1 = Person({}) // ✅
const person2 = Person({ name: {} }) // ✅
const person3 = Person({ title: {} }) // ❌ compile-time error: Person don't have title
const person4 = Person({ _num: [[ Math.PI ]] }) // ❌ run-time error: isn't integer
const person5: typeof Person.Value = person2 // ✅ same type
```
